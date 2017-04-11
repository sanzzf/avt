namespace AudioVisualModule.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class changeEventmodel5 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Events", "UserEmail", c => c.String());
            DropColumn("dbo.Events", "Email");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Events", "Email", c => c.String());
            DropColumn("dbo.Events", "UserEmail");
        }
    }
}
